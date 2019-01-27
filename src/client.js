export default function createClient() {
    
    function getQuestions(){
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("GET", 'http://localhost:3000/api/questions');
            request.addEventListener("load", () => {
                resolve(request.responseText);
            });
            request.addEventListener("error", () => {
                reject(request.statusText);
            });
            request.send();
        });
    }

    return {
        getQuestions
    }
};



