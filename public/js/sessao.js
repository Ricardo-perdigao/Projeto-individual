if (!sessionStorage.VISITOR_ID) {
    sessionStorage.VISITOR_ID = crypto.randomUUID();
}

const VISITOR_ID = sessionStorage.VISITOR_ID;

console.log("VISITOR_ID =", VISITOR_ID);
