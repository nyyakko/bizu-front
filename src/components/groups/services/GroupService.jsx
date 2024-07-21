export class GroupService
{
    headers = { "Authorization": `Bearer ${sessionStorage.getItem("bizu-auth")}` };

    async add(group)
    {
        let response = await fetch("groups/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.headers
            },
            body: JSON.stringify(group)
        });
        return response.json();
    }

    async remove(groupId)
    {
        let response = await fetch(
            `/groups/deleteGroup?id=${groupId}`,
            {
                method: "DELETE",
                headers: this.headers
            });
        return response.json();
    }

    async update(groupId, group)
    {
        let response = await fetch(
            `/groups/group?id=${groupId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...this.headers
                },
                body: JSON.stringify(group)
            });
        return response.json();
    }

    async list()
    {
        let response = await fetch("groups/", {
            method: "GET",
            headers: this.headers
        });
        return response.json();
    }
};
