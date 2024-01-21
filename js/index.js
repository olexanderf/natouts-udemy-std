import "@babel/polyfill";
import $9i5N9$axios from "axios";

/* eslint-disable */ 
/* eslint-disable */ 
const $5076512b374e3991$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, $9i5N9$axios)({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            alert("Logged in successfuly!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        }
    } catch (error) {
        alert(error.response.data.message);
    }
};


document.querySelector(".form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $5076512b374e3991$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=index.js.map
