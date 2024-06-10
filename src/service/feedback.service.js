import http from "../http-common";

class FeedbackDataService {
    create(data) {
        //console.log(data);
        return http.post("/feedback", data);
    }

    findByArtID(art_id){
        return http.get(`/feedback/artID/${art_id}`)
    }

    findByID(id){
        return http.get(`/feedback/${id}`)
    }

    findMaxID(){
        return http.get(`/feedback/feedbackMaxID`);
    }

    findAvgRating(art_id){
        return http.get(`/feedback/avgRating/${art_id}`)
    }

    update(id, data) {
        return http.put(`/feedback/${id}`, data);
    }

    delete(id) {
        return http.delete(`/feedback/${id}`);
    }

    deleteByUser(user_id) {
        return http.delete(`/feedback/userID/${user_id}`);
    }

    deleteByArt(art_id) {
        return http.delete(`/feedback/artID/${art_id}`);
    }
}

export default new FeedbackDataService();