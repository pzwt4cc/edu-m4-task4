import { Component } from "react";
import classNames from "classnames";
import getUsers from "../../api";
import styles from "./UsersLoader.module.scss";

class UsersLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      isFetching: false,
      error: null,
      currentPage: 1,
    };
  }

  loadUsers = () => {
    const { currentPage } = this.state;

    this.setState({ isFetching: true });
    getUsers({ page: currentPage, results: 5 })
      .then((data) => this.setState({ users: data.results }))
      .catch((e) => this.setState({ error: e }))
      .finally(() => this.setState({ isFetching: false }));
  };

  componentDidMount() {
    this.loadUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;

    if (currentPage !== prevState.currentPage) {
      this.loadUsers();
    }
  }

  prevPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  nextPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  };

  render() {
    const { users, isFetching, error } = this.state;

    return (
      <div className={styles.userCard}>
        <div className={styles.nav}>
          <button className={styles.btnNav} onClick={this.prevPage}>
            {"<"}
          </button>
          <button className={styles.btnNav} onClick={this.nextPage}>
            {">"}
          </button>
        </div>

        {error && <div>!!!ERROR!!! {JSON.stringify(error)}</div>}
        {isFetching && <div>Loading. Please waite...</div>}
        {!error && !isFetching && (
          <ul className={styles.userList}>
            {users.map(
              ({
                name: { first, last },
                email,
                login: { username, uuid },
                gender,
              }) => (
                <li className={styles.userListPerson} key={uuid}>
                  <div className={styles.userName}>
                    {first} {last}
                  </div>
                  <div className={styles.userEmail}>{email}</div>
                  <div className={styles.userNickname}>{username}</div>
                  <div
                    className={classNames(styles.userGender, {
                      [styles.genderMale]: gender === "male",
                      [styles.genderFemale]: gender === "female",
                    })}
                  >
                    {gender}
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    );
  }
}

export default UsersLoader;
