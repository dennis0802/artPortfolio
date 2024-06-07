import http from "../http-common";

class TokenDataService{
    createResetToken(id, max){
        return http.post(`/tokens/reset/${id}/${max}`);
    }

    getMaxID(){
        return http.get(`/tokens/maxID`)
    }

    findByUser(user_id){
        return http.get(`/tokens/tokenExists/${user_id}`)
    }

    findByToken(token){
        return http.get(`/tokens/byToken/${token}`)
    }

    delete(user_id) {
        return http.delete(`/tokens/${user_id}`);
    }

    sendResetEmail(username, email, code, token){
        return http.post(`/emails/reset/${username}/${email}/${code}/${token}`)
    }

    sendRegistrationEmail(username, email, code, token){
        return http.post(`/emails/register/${username}/${email}/${code}/${token}`)
    }
}

export default new TokenDataService();