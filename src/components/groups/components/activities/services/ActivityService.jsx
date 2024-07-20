export class ActivityService
{
    headers = { "Authorization": `Bearer ${sessionStorage.getItem("bizu-auth")}` };

    async add(groupId, activity)
    {
        let result = await fetch(`/groups/${groupId}/activity`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.headers
            },
            body: JSON.stringify({ ...activity, groupId: groupId })
        });
        return result.json();
    }

    async remove(groupId, activity)
    {
        let response = await fetch(
            `/groups/${groupId}/deleteActivity?id=${activity.id}`,
            {
                method: "DELETE",
                headers: this.headers
            });
        return response.json();
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
        return response.json();
    }

    async list(groupId)
    {
        let response = await fetch(
            `/groups/${groupId}/activity?id=-1`,
            {
                method: "GET",
                headers: this.headers
            });
        return response.json();
    }
};
