export class ActivityService
{
    headers = { "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("user"))?.["auth"]}` };

    async add(groupId, activity)
    {
        let response = await fetch(`/groups/${groupId}/activity`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.headers
            },
            body: JSON.stringify({ ...activity, groupId: groupId })
        });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async remove(groupId, activityId)
    {
        let response = await fetch(
            `/groups/${groupId}/deleteActivity?id=${activityId}`,
            {
                method: "DELETE",
                headers: this.headers
            });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async update(groupId, activityId, activity)
    {
        let response = await fetch(
            `/groups/${groupId}/activity?id=${activityId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...this.headers
                },
                body: JSON.stringify(activity)
            });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }

    async list(groupId)
    {
        let response = await fetch(
            `/groups/${groupId}/activity?id=-1`,
            {
                method: "GET",
                headers: this.headers
            });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }
};
