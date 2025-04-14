import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

// --- GraphQL Queries & Mutation ---
const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateNewUser(
    $name: String!
    $email: String!
    $age: Int!
    $isMarried: Boolean!
  ) {
    createNewUser(
      name: $name
      email: $email
      age: $age
      isMarried: $isMarried
    ) {
      id
      name
      email
      age
      isMarried
    }
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isMarried: boolean;
}

function App() {
  const [radioValue, setRadioValue] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    email: "",
  });

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery<{ getAllUsers: User[] }>(GET_ALL_USERS);
  const {
    data: userByIdData,
    loading: userByIdLoading,
    error: userByIdError,
  } = useQuery<{ getUserById: User }>(GET_USER_BY_ID, {
    variables: { id: "2" },
  });

  const [createUser] = useMutation(CREATE_USER);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !radioValue ||
      !userDetails.name ||
      !userDetails.age ||
      !userDetails.email
    ) {
      alert("Please fill all fields.");
      return;
    }

    await createUser({
      variables: {
        name: userDetails.name,
        age: parseInt(userDetails.age),
        email: userDetails.email,
        isMarried: radioValue === "yes",
      },
      refetchQueries: [{ query: GET_ALL_USERS }],
    });

    setUserDetails({ name: "", age: "", email: "" });
    setRadioValue(null);
  };

  if (allUsersError || userByIdError) return <h3>Error loading data.</h3>;
  if (allUsersLoading || userByIdLoading) return <h3>Loading...</h3>;
  console.log(userByIdData);

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleClick}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userDetails.name}
          onChange={(e) =>
            setUserDetails((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={userDetails.age}
          onChange={(e) =>
            setUserDetails((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <label>
          <input
            type="radio"
            name="married"
            value="yes"
            checked={radioValue === "yes"}
            onChange={(e) => setRadioValue(e.target.value)}
          />
          Married
        </label>
        <label>
          <input
            type="radio"
            name="married"
            value="no"
            checked={radioValue === "no"}
            onChange={(e) => setRadioValue(e.target.value)}
          />
          Not Married
        </label>
        <button type="submit">Add User</button>
      </form>

      <h2>User by ID</h2>
      {userByIdData && (
        <div>
          <p>{userByIdData.getUserById.name}</p>
          <p>{userByIdData.getUserById.email}</p>
        </div>
      )}

      <h2>All Users</h2>
      {allUsersData &&
        allUsersData.getAllUsers.map((user) => (
          <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.age}</p>
            <p>{user.email}</p>
            <p>{user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}
    </div>
  );
}

export default App;
