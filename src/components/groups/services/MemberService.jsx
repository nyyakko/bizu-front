export class MemberService
{
    headers = { "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("user"))?.["auth"]}` };

    async get(groupId, memberId)
    {
        let response = await fetch(`/groups/${groupId}/member?id=${memberId}`, {
            method: "GET",
            headers: this.headers
        });
        return response.status === 200 ? response.json() : Promise.reject(response.status);
    }
};
