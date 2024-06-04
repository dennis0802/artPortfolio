import http from "../http-common";

class UserDataService {
    create(data) {
        console.log(data);
        return http.post("/users", data);
    }

    get(id) {
        return http.get(`/users/${id}`);
    }

    getByUsername(username) {
        return http.get(`/users/username/${username}`);
    }

    getAllUnpaged(query) {
        return http.get(`/users/unpaged/${query}`);
    }
    
    getAllPaged(page, size, query) {
        return http.get(`/users/paged/${page}/${size}/${query}`);
    }

    getByEmail(email) {
        return http.get(`/users/email/${email}`);
    }

    findMaxID(){
        return http.get(`/users/maxID`);
    }

    verifyPassword(password, stored){
        if(!password){
            return http.get(`/users/password/false/false`)
        }
        else{
            return http.get(`/users/password/${password}/${stored.replace("/", "%2F")}`)
        }
    }

    update(username, data){
        return http.put(`/users/${username}`, data)
    }

    updateLogin(username, data){
        return http.put(`/users/usernameLogin/${username}`, data);
    }

    delete(username) {
        return http.delete(`/users/${username}`);
    }
}

export default new UserDataService();
