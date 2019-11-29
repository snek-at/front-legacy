import * as queries from "./Queries";
import * as apollo from "./../../../UtilsApollo";

export class Connection {
  constructor(link, user) {
    if (link) {
      const parts = link.split("://")
      parts[0] === link ? this.link = `https://${link}` : this.link = `https://${parts[1]}`;
      this.user = user;
      this.authorization = `Bearer ${user.token}`;
      console.log(this.link)
      this.client = apollo.init(this.link, this.authorization);
      this.profileQuery = queries.GET_PROFILE;
      this.calendarQuery = queries.getCalendar;
    } else {
      throw "No valid link!"
    };
  }

  async profile(){
    console.log("start queries profile")
    return await this.client.query({
      query: this.profileQuery,
      variables: {
        username: this.user.username
      }
    }).then(res => {
      return res.data;
    });
  }

  async calendar(createdAtDate){
    return await this.client.query({
      query: this.calendarQuery(this.user.username, createdAtDate)
    }).then(res => {
      return res.data;
    });
  }
}