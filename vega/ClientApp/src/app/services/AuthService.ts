import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private roles: string[] = [];
  private clientId: string = "ZMmmqEC2ZKlbCVm1Gc66BPSTzDLw6s0V";

  // Create an observable of Auth0 instance of client
  private auth0Client$ = (from(
    createAuth0Client({
      domain: "vega-project-ua.auth0.com",
      client_id: this.clientId,
      scope: "openid profile email",
      audience: "https://api.vega.com",
      redirect_uri: this.getCallbackUri()
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );

  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  private isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => this.loggedIn = res)
  );
  private handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );

  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject$.asObservable();

  // Create a local property for login status
  public loggedIn: boolean = null;

  constructor(private router: Router) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
  }

  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  public getUser$(options?): Observable<any> {

    this.getRolesFromToken();

    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user))
    );
  }

  private isInRole(roleName: string): boolean {
    if (this.roles)
      return this.roles.indexOf(roleName) > -1;
    return false;
  }

  public isAdmin(): boolean {
    return this.isInRole("Admin");
  }

  public isModerator(): boolean {
    return this.isInRole("Moderator");
  }

  public getRolesFromToken() {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.getIdTokenClaims()
        .then(idToken => {
          this.roles = idToken["https://vega.com/roles"];
        });
    });
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {

          this.setToken();
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

  private setToken() {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.getTokenSilently()
        .then(token => {
          localStorage.setItem("access_token", token);
        });
    });
  }

  public login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: this.getCallbackUri(),
        appState: { target: redirectPath }
      });
    });
  }

  private getCallbackUri(): string {
    return `${window.location.origin}`;
  }

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        console.log("user", user);
        this.router.navigate([targetRoute]);
      });
    }
  }

  public logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: this.clientId,
        returnTo: this.getCallbackUri()
      });
      this.roles = [];
    });
  }
}