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
    public login(username, password, rememberMe): Promise<any> {
      return new Promise((resolve, reject) => {
        fetch(this.baseUrl + "/login", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          referrerPolicy: "no-referrer",
          body: JSON.stringify({ username, password }),
        })
          .then(async (response) => {
            if (rememberMe) {
              const token = await response.json();
              localStorage.setItem("auth_token", token);  
            }
            
            fetch(this.baseUrl + "/profile/" + username, {
              method: "GET",
              mode: "cors",
              referrerPolicy: "no-referrer",
            }).then((response) => {
              let profile = response.json();
              fetch(this.baseUrl + "/roles/" + username, {
                method: "GET",
                mode: "cors",
                referrerPolicy: "no-referrer",
              })
                .then((response2) => {
                  const groups = response.json();
                  resolve({ profile, groups });
                })
                .catch((e) => {
                  reject(e);
                });
            });
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  
    public async getProfileForLoggedInUser(): Promise<any> {
      let token = localStorage.getItem("auth_token");
  
      const response = await fetch(this.baseUrl + "/get?token=" + token, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
  
      const { username } = await response.json();
  
      return fetch(this.baseUrl + "/profile/" + username, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "no-referrer",
      }).then((response) => {
        let profile = response.json();
        fetch(this.baseUrl + "/roles/" + username, {
          method: "GET",
          mode: "cors",
          referrerPolicy: "no-referrer",
        }).then((response2) => {
          const groups = response.json();
          return { profile, groups };
        });
      });
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
  
