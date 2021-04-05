package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"github.com/upper/db/v4"
	"github.com/upper/db/v4/adapter/cockroachdb"
)

// Set the database credentials using the ConnectionURL type provided by the
// adapter.
var settings = cockroachdb.ConnectionURL{
	Database: `game`,
	Host:     `localhost`,
	User:     `maxroach`,
	//	Password: `demop4ss`,
	Options: map[string]string{
		// Insecure node.
		"sslmode": "disable",
	},
}

type Score struct {
	ID       string `db:"id,omitempty"`
	Points   int64  `db:"points"`
	UserName string `db:"username"`
}

// createTables creates all the tables that are neccessary to run this example.
func createTables(sess db.Session) error {
	_, err := sess.SQL().Exec(`
	CREATE TABLE game.scores (
		id UUID PRIMARY KEY, 
		points DECIMAL
		,username VARCHAR);

    `)
	if err != nil {
		return err
	}
	return nil
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(render.SetContentType(render.ContentTypeJSON))
	// Use Open to access the database.
	sess, err := cockroachdb.Open(settings)
	if err != nil {
		log.Fatal("Open: ", err)
	}
	defer sess.Close()

	fmt.Printf("Connected to %q with DSN:\n\t%q", sess.Name(), settings)
	createTables(sess)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		scoreCol := sess.Collection("scores")
		res := scoreCol.Find()
		res = res.OrderBy("-points") // ORDER BY title DESC

		var scores []*Score

		if err = res.All(&scores); err != nil {
			log.Fatal("booksCol.Find: ", err)
		}

		/*	fmt.Printf("Records in the %q collecticcon:\n", scoreCol.Name())
			for _, score := range scores {
				fmt.Printf("%q:\t %q \t %d \n", score.ID, score.UserName, score.Points)

			}*/
		render.RenderList(w, r, NewScoreListResponse(scores))
	})

	r.Route("/score", func(r chi.Router) {
		r.Post("/", func(w http.ResponseWriter, r *http.Request) {
			data := &ScoreRequest{}
			if err := render.Bind(r, data); err != nil {
				render.Render(w, r, ErrInvalidRequest(err))
				return
			}

			sc := data.Score
			res, err := sess.SQL().
				InsertInto("scores").
				Values(sc).
				Exec()
			if err != nil {
				render.Render(w, r, ErrInvalidRequest(err))
				return
			}
			if res != nil {
				render.Status(r, http.StatusCreated)
				fmt.Printf("type: %T\n", res)
				render.Render(w, r, NewScoreResponse(sc))
				//render.Render(w, r, NewScoreResponse(res))

			}

		})

	})

	http.ListenAndServe(":3333", r)

}
func NewScoreListResponse(scores []*Score) []render.Renderer {
	list := []render.Renderer{}
	for _, sc := range scores {
		list = append(list, NewScoreResponse(sc))
	}
	return list
}

func (rd *ScoreResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewScoreResponse(sc *Score) *ScoreResponse {
	resp := &ScoreResponse{Score: sc}
	return resp
}

type ScoreResponse struct {
	*Score
}

type ScoreRequest struct {
	*Score
}

func (a *ScoreRequest) Bind(r *http.Request) error {

	if a.Score == nil {
		return errors.New("missing required Article fields")
	}
	return nil
}

type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}

var ErrNotFound = &ErrResponse{HTTPStatusCode: 404, StatusText: "Resource not found."}
