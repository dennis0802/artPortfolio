import http from "../http-common";

class StatusDataService {
    get(user_id) {
        return http.get(`/tokens/registration/${user_id}`);
    }

    findByToken(token){
        return http.get(`/tokens/registrationByToken/${token}`)
    }

    findByUser(user_id){
        return http.get(`/tokens/registrationExists/${user_id}`)
    }

    create(data) {
        //console.log(data);
        return http.post("/tokens/registration", data);
    }

    update(user_id, data){
        return http.put(`/tokens/registration/${user_id}`, data)
    }

    updateWithNewToken(user_id, data){
        return http.put(`/tokens/registrationRefresh/${user_id}`, data)
    }

    delete(user_id) {
        return http.delete(`/tokens/registration/${user_id}`);
    }

    getMaxID(){
        return http.get(`/tokens/registrationMaxID`);
    }
}

export default new StatusDataService();