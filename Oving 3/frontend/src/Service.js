import axios from 'axios';

class Service {
    sendCode(message) {
        console.log(message);
        return axios.post("http://127.0.0.1:8000/code/", message);
    }

}

export default Service

