import React, {Component, PropTypes} from 'react';
import colors from '../../colors';

class UserList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const listNode = this.refs.list;
    listNode.scrollTop = listNode.scrollHeight;
  }

  render() {
    const list = this.props.users.map((user, index) => (
      <li key={index}><b style={{color: colors(user)}}>{user}</b></li>
    ));
    const numUsers = this.props.users.length;
    return (
      <div>
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
