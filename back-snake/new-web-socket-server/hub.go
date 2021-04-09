package main

import (
	"fmt"

	"encoding/json"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	clientsmap map[string]*Client

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		clientsmap: make(map[string]*Client),
	}
}

func (h *Hub) run() {

	for {
		select {
		case client := <-h.register:
			fmt.Println("registering")
			h.clients[client] = true
			h.clientsmap[client.PlayerId] = client
			newplayer, err := json.Marshal(&client)
			if err != nil {
				fmt.Println(err)
				return
			}
			current_players, err := json.Marshal(h.clientsmap)
			if err != nil {
				fmt.Println(err)
				return
			}
			client.send <- []byte("current players")
			client.send <- current_players
			for client := range h.clients {

				client.send <- []byte("new Player ")
				client.send <- newplayer

			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				delete(h.clientsmap, client.PlayerId)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}

	}
}
