import { useState } from "react";

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
  }
];

export default function App(){
  const[friend,setFriend] = useState(initialFriends);
  const[showAddFri,setShowAddFri] = useState(false);
  const[selectedFriend, setSelectedFriend] = useState(null);
  function handleShowAddFriend(){
    setShowAddFri((show)=>!show);
  }

  function handleAddFriend(friend){
    setFriend((friends)=>[...friends,friend]);
    setShowAddFri(false);
  }

  function handleSelection(friend){
    //setSelectedFriend(friend);
    setSelectedFriend((cur)=> cur?.id===friend.id ? null : friend);
    setShowAddFri(false);
  }

  function handleSplitBill(value){
    console.log(value);
    setFriend((friends)=>
      friends.map((friend)=>
        friend.id=== selectedFriend.id ?
        {...friend,balance:friend.balance +value}:friend));
    setSelectedFriend(null);
  }
  return( 
  <div className="app">
    <div className="sidebar">
        <FriendList 
        friends = {friend} 
        onSelection={handleSelection}
        selectedFriend={selectedFriend}/>
        {showAddFri && <FormAddFriend onAddFriend={handleAddFriend}/>}
        <Button onClick={handleShowAddFriend}>{showAddFri ?'close':'Add Friend'}</Button>
    </div>
       {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
 
  </div>
  );
}
function Button({children, onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}

function FriendList({friends, onSelection, selectedFriend}){

  return <ul>
    {friends.map((friend)=>(
          <Friend 
          friend= {friend} 
          key={friend.id} 
          onSelection={onSelection}
          selectedFriend={selectedFriend}/>
    ))}
  </ul>;
}

function Friend({friend, onSelection, selectedFriend}){
  const isSelected = selectedFriend?.id === friend.id;
 return (
 <li className={isSelected ? "selected":""}>
     <img src={friend.image} alt={friend.name}/>
     <h3>{friend.name}</h3>
     {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}€</p>}
     {friend.balance > 0 && <p className="green">{friend.name} owes you {Math.abs(friend.balance)}€</p>}
     {friend.balance === 0 && <p>You and {friend.name} are equal</p>}
     <Button onClick={()=>onSelection(friend)}>{isSelected ? "Close": "Select"}</Button>
</li>
 );
}

function FormAddFriend({onAddFriend}){
  const[name,setName] = useState("");
  const[img,setImg] = useState("https://i.pravatar.cc/48?u");

  function handleSubmit(e){
    e.preventDefault();
    if(!name || !img) return;
    const id = Math.trunc(Math.random() * 1000000);
    const newFriend ={
      name,
      img:`${img}=${id}`,
      balance: 0,
      id
    };
    console.log(newFriend);
    onAddFriend(newFriend);
  
    setName("");
    setImg("https://i.pravatar.cc/48?u")
  }

  return (
  <form className="form-add-friend" onSubmit={handleSubmit}>
    <label><pre>🤝Friend name</pre></label>
    <input type="text" 
    value={name}
    onChange= {(e)=>setName(e.target.value)}
    />

    <label>📂Image URL</label>
    <input type="text"
    value={img}
    onChange={(e)=>setImg(e.target.value)}/>
    <Button>Add</Button>
  </form>
  )
}

function FormSplitBill({selectedFriend, onSplitBill}){
  const [bill,setBill] = useState('');
  const [paidByUser,setPaidByUser] = useState('');
  const [whoIsPaying,setWhoisPaying] = useState("user");
  const paidByFriend = bill ? bill - paidByUser: "";

  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend: -paidByUser)
  }
  return (
  <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a bill with {selectedFriend.name}</h2>

    <label>💰Bill value</label>
    <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

    <label>🙋‍♂️Your Expense</label>
    <input type="text" value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value)> bill ? paidByUser:Number(e.target.value))}/>

    <label>🧑‍🤝‍🧑{selectedFriend.name}'s Expense</label>
    <input type="text" disabled value={paidByFriend}/>

    <label> Who is paying the bill</label>
    <select value={whoIsPaying} onChange={(e)=>setWhoisPaying(e.target.value)}>
      <option value='user'>You</option>
      <option value='friend'>{selectedFriend.name}</option>
    </select>
    <Button>Split Bill</Button>

  </form>
  )
}