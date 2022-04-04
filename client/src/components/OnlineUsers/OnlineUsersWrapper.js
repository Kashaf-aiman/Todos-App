import React, { Fragment,useEffect, useState } from "react";
import { useMutation, gql, useSubscription} from "@apollo/client";
import OnlineUser from "./OnlineUser";

const UPDATE_LASTSEEN_MUTATION = gql`
mutation updateLastSeen($now: timestamptz!) {
  update_users(where: {}, _set: { last_seen: $now }) {
    affected_rows
  }
}
`;
// 

const OnlineUsersWrapper = () => {
  const [onlineIndicator, setOnlineIndicator] = useState(0);
  let onlineUsersList ;
  
  useEffect(() => {
    //execute set inteerval every 30 seconds
    updateLastSeen();
    setOnlineIndicator(setInterval(() => updateLastSeen(), 30000));

    return () => {
      //cleanup 
      clearInterval(onlineIndicator);
    }
  },[])

  const [updateLastSeenMutation] = useMutation(UPDATE_LASTSEEN_MUTATION);

  const updateLastSeen = () => {
    updateLastSeenMutation({
      variables: { now: new Date().toISOString() },
    })
  }

  const onlineUserSubscription = gql`
    subscription getOnlineUsers {
      online_users(order_by: { user: { name: asc } }) {
        id
        user {
          name
        }
      }
    }
  `;

const { loading,error,data } = useSubscription(onlineUserSubscription);

if(loading) {
  return <div>Loading...</div>
}
if(error) {
  return <div>Error...</div>
}
if(data) {
  onlineUsersList = data.online_users.map((u) => {
   return ( <OnlineUser key={u.id} user = {u.user} />)
  })
}


  return (
    <div className="onlineUsersWrapper">
      <Fragment>
      <div className="sliderHeader">
        Online users - {onlineUsersList.length}
        </div>
      {onlineUsersList}
      </Fragment>
    </div>
  );
};

export default OnlineUsersWrapper;
