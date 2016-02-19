import React, {Component, PropTypes} from 'react';
import hashColor from '../hashColor';

class UserList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const listNode = this.refs.list;
    listNode.scrollTop = listNode.scrollHeight;
  }

  render() {
    const users = this.props.users;
    const numUsers = this.props.users.length;

    users.sort((a, b) => {
      a = a.toLowerCase(), b = b.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    const list = users.map((username, index) => (
      <li id="userlist" key={index}>
        <strong style={{color: hashColor(username)}}>{username}</strong>
      </li>
    ));

    return (
      <div className="col-md-1">
        <small>{numUsers} {numUsers === 1 ? 'User' : 'Users'}</small>
        <ul className="list-unstyled" ref="list">
          {list}
        </ul>
      </div>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default UserList;
