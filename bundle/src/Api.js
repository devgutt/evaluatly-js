
export async function api(method, url, par) {
    let init = {
        method: method
    };

    if (par) {
        if (method === "POST") {
            init.body = par
        } else if (method === "GET") {
            if (par instanceof URLSearchParams) {
                url = url + "?" + par.toString();
            }
        }
    }
        
    const response = await fetch(url, init);

    try {
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        return false;
    }
    return false;
    
}
