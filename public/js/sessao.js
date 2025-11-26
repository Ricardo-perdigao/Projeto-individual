if (!sessionStorage.VISITOR_ID) {
    sessionStorage.VISITOR_ID = Math.random() * 10000000000000000;
}

const VISITOR_ID = sessionStorage.VISITOR_ID;

console.log("VISITOR_ID =", VISITOR_ID);
