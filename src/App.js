import React from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
//------------------------------------------------------------------------------------------------------------------
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
//------------------------------------------------------------------------------------------------------------------
export default function App() {
  const [friend, setFriend] = React.useState(initialFriends);
  const [showAddFriendForm, setshowAddFriendForm] = React.useState(false);
  const [select, setSelect] = React.useState(null);
  function handleAddFriend(friend) {
    setFriend((friends) => [...friends, friend]);
    setshowAddFriendForm(false);
    // setSelect(null);
  }

  function handleSelect(friend) {
    setSelect((curr) => (curr?.id === friend.id ? null : friend));
    setshowAddFriendForm(false);
  }

  function handleSplittBill(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === select.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelect(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <h1>Split Bill</h1>
        <FriendsList
          friends={friend}
          onSelection={handleSelect}
          select={select}
        />
        {showAddFriendForm && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={() => setshowAddFriendForm(!showAddFriendForm)}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {select && (
        <FormSplitBill select={select} onSplitBill={handleSplittBill} />
      )}
    </div>
  );
}
//------------------------------------------------------------------------------------------------------------------

function FriendsList({ friends, onSelection, select }) {
  return (
    <ul className="sidebar">
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          select={select}
        />
      ))}
    </ul>
  );
}
//------------------------------------------------------------------------------------------------------------------

function Friend({ friend, onSelection, select }) {
  const isSelected = friend.id === select.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {parseInt(friend.balance) < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}$
        </p>
      )}
      {parseInt(friend.balance) > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      {parseInt(friend.balance) === 0 && <p>{friend.name} is settled up</p>}
      <Button
        onClick={() => {
          onSelection(friend);
        }}
      >
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}
//------------------------------------------------------------------------------------------------------------------

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState(
    `https://i.pravatar.cc/48?u=${parseInt(
      ("" + Math.random()).substring(2, 7)
    )}`
  );
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage(
      `https://i.pravatar.cc/48?u=${parseInt(
        ("" + Math.random()).substring(2, 7)
      )}`
    );
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🦰Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
//------------------------------------------------------------------------------------------------------------------

function FormSplitBill({ select, onSplitBill }) {
  const [bill, setBill] = React.useState("");
  const [paidByUser, setPaidByUser] = React.useState("");
  const [whoIsPaying, setWhoIsPaying] = React.useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Splitt a Bill With {select.name}</h2>
      <label>💰 Total Amount</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>💰 Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>💰 {select.name} Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>💵 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{select.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
}
