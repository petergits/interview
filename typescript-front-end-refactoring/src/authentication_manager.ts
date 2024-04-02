export class AuthenticationManager {
    private baseUrl: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    public async isLoggedIn(): Promise<boolean> {
        const token = localStorage.getItem("auth_token");

        try {
          const valid = await this.validateToken(token);
          if (valid) {
            console.log("token valid ");
            return true;
          } else {
            console.log("token not valid ");
            localStorage.removeItem("auth_token");
            return false;
          }
        } catch (error) {
          console.error("Error validating token:", error);
          return false;
        }
    }
  
    private async validateToken(token: string): Promise<boolean> {
        const response = await fetch(this.baseUrl + "/validateToken", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ token }),
        });
    
        if (response.ok) {
          return true;
        } else {
          console.debug("clearing auth token because it failed validation");
          localStorage.removeItem("auth_token");
          return false;
        }
    }  
    public async login(username: string, password: string, rememberMe: boolean): Promise<any> {
    try {
      const response = await fetch(this.baseUrl + "/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ username, password }),
      });

      if (rememberMe && response.ok) {
        const token = await response.json();
        localStorage.setItem("auth_token", token);
      }

      const profileResponse = await fetch(this.baseUrl + "/profile/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const profile = await profileResponse.json();

      const groupsResponse = await fetch(this.baseUrl + "/roles/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const groups = await groupsResponse.json();

      return { profile, groups };
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
  
  public async login(username: string, password: string, rememberMe: boolean): Promise<any> {
    try {
      const response = await fetch(this.baseUrl + "/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ username, password }),
      });

      if (rememberMe && response.ok) {
        const token = await response.json();
        localStorage.setItem("auth_token", token);
      }

      const profileResponse = await fetch(this.baseUrl + "/profile/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const profile = await profileResponse.json();

      const groupsResponse = await fetch(this.baseUrl + "/roles/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const groups = await groupsResponse.json();

      return { profile, groups };
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
    
  public async getProfileForLoggedInUser(): Promise<any> {
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(this.baseUrl + "/get?token=" + token, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const { username } = await response.json();

      const profileResponse = await fetch(this.baseUrl + "/profile/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const profile = await profileResponse.json();

      const groupsResponse = await fetch(this.baseUrl + "/roles/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      const groups = await groupsResponse.json();

      return { profile, groups };
    } catch (error) {
      console.error("Error getting profile for logged in user:", error);
      throw error;
    }
  }


    public async logout(): Promise<void> {
      let token: string = localStorage.get("auth_token");
  
      await fetch(this.baseUrl + "/logout", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ token: token }),
      });
  
      localStorage.removeItem("auth_token");
  
      // await fetch(this.baseUrl + "/get?token=" + token, {
      //   method: "GET",
      //   mode: "cors",
      //   referrerPolicy: "no-referrer",
      // });
    }
  }
  
