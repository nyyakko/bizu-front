export class GroupService
{
    headers = { "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("user"))?.["auth"]}` };

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
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async remove(groupId)
    {
        let response = await fetch(
            `/groups/deleteGroup?id=${groupId}`,
            {
                method: "DELETE",
                headers: this.headers
            });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
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
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async list()
    {
        let response = await fetch("/groups/", {
            method: "GET",
            headers: this.headers
        });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async joinGroupByInvite(key)
    {
        let response = await fetch(`/groups/invite?key=${key}`, {
            method: "POST",
            headers: this.headers
        });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async createGroupInvite(groupId)
    {
        let response = await fetch(`/groups/${groupId}/invite`, {
            method: "POST",
            headers: this.headers
        });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }
};
