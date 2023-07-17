import { useEffect, useState } from "react";
import ListItem from "./components/ListItem";
import ListHeader from "./components/ListHeader";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;

  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    const email = userEmail;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_GOSERVER}/todos/${email}`
      );
      const json = await response.json();
      console.log(json);
      setTasks(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(authToken){
    getData()
  }}, [authToken]);

  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="app">
      {!authToken && <Auth />}

      {authToken && (
        <>
          <ListHeader listName={"🦆 Holiday tick list"} getData={getData} />
          {sortedTasks?.map((task) => {
            return <ListItem key={task.id} task={task} getData={getData} />;
          })}
        </>
      )}
    </div>
  );
}

export default App;
