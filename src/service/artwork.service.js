import http from "../http-common";

class ArtworkDataService {
  getAll() {
    return http.get("/artwork");
  }

  get(id) {
    return http.get(`/artwork/${id}`);
  }

  create(data) {
    console.log(data);
    return http.post("/artwork", data);
  }

  update(id, data) {
    return http.put(`/artwork/${id}`, data);
  }

  delete(id) {
    return http.delete(`/artwork/${id}`);
  }

  deleteAll() {
    return http.delete(`/artwork`);
  }

  deleteAllByYear(year){
    return http.delete(`/artwork/artworkByYear/${year}`);
  }

  findByTitle(title) {
    return http.get(`/artwork/artworkByTitle/${title}`);
  }

  findByYear(year){
    return http.get(`/artwork/artworkByYear/${year}`)
  }

  findMaxID(){
    return http.get(`/artwork/maxID`);
  }
}

export default new ArtworkDataService();
