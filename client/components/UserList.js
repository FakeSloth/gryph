import React, {Component, PropTypes} from 'react';
import toId from 'toid';
import hashColor from '../../hashColor';

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
      a = a.name.toLowerCase(), b = b.name.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    const list = users.map((user, index) => (
      <li id="userlist" key={index}>
        <span className="rank" dangerouslySetInnerHTML={{__html: user.rank}}></span>
        <strong style={{color: hashColor(toId(user.name))}}>
          {user.name}
        </strong>
      </li>
    ));

    return (
      <div className="col-md-1">
        <div className="text-center">
          <small>{numUsers} {numUsers === 1 ? 'User' : 'Users'}</small>
        </div>
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
