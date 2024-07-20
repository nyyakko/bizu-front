async function digestMessage(message)
{
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

export class UserService
{
    headers = { "Authorization": `Bearer ${sessionStorage.getItem("bizu-auth")}` };

    async add(user)
    {
        let response = await fetch(`/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...user, auth: await digestMessage(user.name + user.password) })
        });
        return response.json();
    }

    async remove(userId)
    {
        let response = await fetch(`/users/deleteUser?id=${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...this.headers
            },
        });
        return response.json();
    }

    async update(userId, user)
    {
        let response = await fetch(`/users/user?id=${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...this.headers
            },
            body: JSON.stringify(user)
        });
        return response.json();
    }

    async find(user)
    {
        let response = await fetch(`/users/user?name=${user.name}&password=${user.password}`);
        return response.json();
    }
};
