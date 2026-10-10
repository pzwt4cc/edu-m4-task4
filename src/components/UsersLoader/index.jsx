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
      resultCount: 5,
      genderFilter: "all",
    };
  }

  loadUsers = () => {
    const { currentPage, resultCount, genderFilter } = this.state;

    const options = {
      page: currentPage,
      results: resultCount,
    };

    if (genderFilter !== "all") {
      options.gender = genderFilter;
    }

    this.setState({ isFetching: true });
    getUsers(options)
      .then((data) => this.setState({ users: data.results }))
      .catch((e) => this.setState({ error: e }))
      .finally(() => this.setState({ isFetching: false }));
  };

  componentDidMount() {
    this.loadUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, resultCount, genderFilter } = this.state;

    if (
      currentPage !== prevState.currentPage ||
      resultCount !== prevState.resultCount ||
      genderFilter !== prevState.genderFilter
    ) {
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

  resultCountHandler = (e) => {
    const result = Number(e.target.value);
    this.setState({ currentPage: 1, resultCount: result });
  };

  genderFilterHandler = (e) => {
    const gender = e.target.value;
    this.setState({ currentPage: 1, genderFilter: gender });
  };

  render() {
    const { users, isFetching, error, resultCount, genderFilter } = this.state;

    return (
      <div className={styles.userCard}>
        <div className={styles.nav}>
          <select value={genderFilter} onChange={this.genderFilterHandler}>
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select value={resultCount} onChange={this.resultCountHandler}>
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
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
