class Service {
     GET(url) {
         try {
             return axios.get(url);
         } catch (e) {
             return e;
         }

    }
}