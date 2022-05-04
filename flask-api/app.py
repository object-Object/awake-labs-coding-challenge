from flask import Flask, request, jsonify
from sqlalchemy import create_engine, Table, select, Column, Integer, VARCHAR
from sqlalchemy.orm import declarative_base, Session

# connect to the customers database
engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5432/customers", echo=True, future=True)
Base = declarative_base()

# declare the ORM class for the Users table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    location = Column(VARCHAR(255))
    alias = Column(VARCHAR(255))
    email = Column(VARCHAR(255))

    # lets me convert a User to a dict
    def __iter__(self):
        yield from {
            "id": self.id,
            "location": self.location,
            "alias": self.alias,
            "email": self.email,
        }.items()

# Flask routes
app = Flask(__name__)

# create a new user
# if any fields are missing, responds with 400
@app.route("/api/users", methods=["POST"])
def create():
    user = User(
        location = request.form["location"],
        alias = request.form["alias"],
        email = request.form["email"],
    )
    with Session(engine) as session:
        session.add(user)
        session.commit() # need to commit before returning the user so the id isn't null
        return dict(user)

# get a list of users
@app.route("/api/users")
def read_all():
    with Session(engine) as session:
        users = session.execute(select(User)).scalars()
        return jsonify([dict(user) for user in users])

# get a specific user
# this isn't actually used in the frontend
@app.route("/api/users/<int:user_id>")
def read(user_id):
    with Session(engine) as session:
        user = session.execute(select(User).where(User.id == user_id)).scalars().first()
        if user is None:
            # TODO: better error message
            # I think 404 is more accurate than 400 here, even though technically 400 would also make sense
            return "Unknown user", 404
        return dict(user)

# update a specific user
# if any fields are missing, responds with 400
# allows PUT (replace all the values) or PATCH (change specific values and leave the rest the same)
@app.route("/api/users/<int:user_id>", methods=["PUT", "PATCH"])
def update(user_id):
    with Session(engine) as session:
        user = session.execute(select(User).where(User.id == user_id)).scalars().first()
        if user is None:
            # TODO: better error message
            return "Unknown user", 404

        if request.method == "PUT":
            # PUT replaces the object, so everything must be present
            user.location = request.form["location"]
            user.alias = request.form["alias"]
            user.email = request.form["email"]
        else: # PATCH (this isn't actually used in the frontend)
            # PATCH modifies the object, so not everything needs to be present
            # TODO: raise an error if nothing was changed
            user.location = request.form.get("location", user.location)
            user.alias = request.form.get("alias", user.alias)
            user.email = request.form.get("email", user.email)

        session.commit()
        return dict(user)

# delete a specific user
@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete(user_id):
    with Session(engine) as session:
        user = session.execute(select(User).where(User.id == user_id)).scalars().first()
        if user is None:
            # TODO: better error message
            return "Unknown user", 404
        session.delete(user)
        session.commit()
        return dict(user) # return the user that was deleted in case the frontend wants to do something with it