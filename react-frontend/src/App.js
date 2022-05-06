import './App.css';
import { Component } from 'react';

/**
 * Form fields for editing a row of the UserTable. Only one of these can be active at a time.
 * @param {{user, form, onChange, onCancel}} props 
 */
function EditFormRow(props) {
  // no onSubmit prop needed because that's handled by the form
  return (
    <tr>
      <td>{props.user.id}</td>
      <td><input
        name="location"  
        type="text"
        value={props.user.location}
        onChange={props.onChange}
        form={props.form}
      /></td>
      <td><input
        name="alias"  
        type="text"
        value={props.user.alias}
        onChange={props.onChange}
        form={props.form}
      /></td>
      <td><input
        name="email"  
        type="text"
        value={props.user.email}
        onChange={props.onChange}
        form={props.form}
      /></td>
      <td><button onClick={props.onCancel}>Cancel</button></td>
      <td><input type="submit" value="Save" form={props.form} /></td>
    </tr>
  );
}

/**
 * A single data row of the UserTable. Switches to an EditFormRow if the current row is being edited.
 * @param {{key, user, editingUser, form, onEditText, onEdit, onChange, onCancel, onDelete}} props 
 */
function UserTableRow(props) {
  if (props.editingUser != null && props.editingUser.id === props.user.id) {
    return <EditFormRow
      user={props.editingUser}
      form={props.form}
      onChange={props.onChange}
      onCancel={props.onCancel}
    />;
  } else {
    // the last line is because it wouldn't make sense for there to be a Delete button on the New row
    return (
      <tr>
        <td>{props.user.id}</td>
        <td>{props.user.location}</td>
        <td>{props.user.alias}</td>
        <td>{props.user.email}</td>
        <td><button onClick={props.onEdit}>{props.onEditText}</button></td>
        {props.onDelete ? <td><button onClick={props.onDelete}>Delete</button></td> : null}
      </tr>
    );
  }
}

/**
 * The big class that manages the table of data. Handles sending CRUD requests.
 */
class UserTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      editingUser: null
    };
  }

  // get the user list from the API, convert it to an object, and put it in the state
  fetchData() {
    fetch("/api/users")
      .then(response => response.json())
      .then(users => this.setState({ users }));
  }

  // fetch the data the first time the page loads
  componentDidMount() {
    this.fetchData();
  }

  // called when someone clicks the New button
  onNew = () => {
    this.setState({
      editingUser: {
        id: "",
        location: "",
        alias: "",
        email: ""
      }
    });
  }

  // called when someone clicks the Edit button
  onEdit(user) {
    this.setState({
      editingUser: { ...user } // clone it so we don't change the table while typing
    });
  }

  // called when someone clicks the Cancel button
  // no need to roll anything back, since we don't commit any changes until the Save button is pressed
  onCancel = () => {
    this.setState({
      editingUser: null
    });
  }

  // called when someone clicks the Delete button
  // TODO: add a confirmation message, eg. "Are you sure you want to do this?"
  async onDelete(user) {
    // await so that we don't fetch the new data until the request is completed
    await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    this.fetchData();
  }

  // called when someone types in a form field
  onChange = (event) => {
    // setState merges shallow, so need to manually copy and edit this
    var editingUser = { ...this.state.editingUser };
    editingUser[event.target.name] = event.target.value;
    this.setState({ editingUser });
  }

  // called when an EditRowForm is submitted
  onSubmit = async (event) => {
    event.preventDefault();
    if (this.state.editingUser == null) {
      return;
    }

    // API requires a POST request for creating a new user, so change the route and method as needed
    // if we're editing the New row, .id will be ""
    let route, method;
    if (this.state.editingUser.id === "") {
      route = "/api/users";
      method = "POST";
    } else {
      route = `/api/users/${this.state.editingUser.id}`;
      method = "PUT";
    }

    // API wants x-www-form-urlencoded
    const body = new URLSearchParams({
      location: this.state.editingUser.location,
      alias: this.state.editingUser.alias,
      email: this.state.editingUser.email
    });

    // await so that we don't fetch the new data until the request is completed
    await fetch(route, { method, body });

    // stop editing and fetch the new data
    this.onCancel();
    this.fetchData();
  }

  render() {
    // can't put a form in a table, so put the form outside the table and use the form attribute for the fields
    // apparently this is experimental, but it seems to work fine (probably doesn't work in IE, though)
    return (
      <div>
        {this.state.editingUser != null ? <form id="edit_form" onSubmit={this.onSubmit} /> : null}
        <table>
          <thead>
            <tr>
              <th className="id-column">ID</th>
              <th className="content-column">Location</th>
              <th className="content-column">Alias</th>
              <th className="content-column">Email</th>
              <th className="button-column"></th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user, key) => (
              <UserTableRow
                key={key}
                user={user}
                editingUser={this.state.editingUser}
                form="edit_form"
                onEditText="Edit"
                onEdit={() => this.onEdit(user)}
                onChange={this.onChange}
                onCancel={this.onCancel}
                onDelete={() => this.onDelete(user)}
              />
            ))}
            <UserTableRow
              key="New"
              user={{
                id: "",
                location: "",
                alias: "",
                email: ""
              }}
              editingUser={this.state.editingUser}
              form="edit_form"
              onEditText="New"
              onEdit={this.onNew}
              onChange={this.onChange}
              onCancel={this.onCancel}
              onDelete={null}
            />
          </tbody>
        </table>
      </div>
    );
  }
}

function App() {
  return (
    <UserTable />
  );
}

export default App;
