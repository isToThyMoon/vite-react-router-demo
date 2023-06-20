/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-06-20 21:19:59
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-06-20 23:57:35
 * @FilePath: /vite-react-router-demo/src/routes/root.tsx
 * @Description: 
 */
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from '../contacts';
import { useEffect } from "react";

export async function loader({request}: any){
  console.log('root loader')
  // const contacts = await getContacts() as any[];
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q) as any[];;
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  // return { contact };
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {

  const { contacts, q } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    "q"
  );

  useEffect(() => {
    // 用户在携带q参数回退前进时，需要将input的值设置为q
    // 你也可以将input作为完全受控组件来实现此功能 但代码会更多
    (document.getElementById("q") as HTMLInputElement).value = q as string;

  }, [q])
  
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
        {/* Because this is a GET, not a POST, React Router does not call the action. Submitting a GET form is the same as clicking a link: only the URL changes. 
        That's why the code we added for filtering is in the loader, not the action of this route.
This also means it's a normal page navigation. You can click the back button to get back to where you were. */}
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q as string}
              // onChange={(event) => {
              //   // 每次输入都会触发loader
              //   submit(event.currentTarget.form);
              // }}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
              
            />
            <div
              id="search-spinner"
              aria-hidden
              // hidden={true}
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          <ul>
            <li>
              {/* <a href={`/contacts/1`}>Your Name</a> */}
              <NavLink to={`contacts/1`}>Your Name</NavLink>
            </li>
            <li>
              {/* <a href={`/contacts/2`}>Your Friend</a> */}
              <NavLink to={`contacts/2`}>Your Friend</NavLink>
            </li>
          </ul>
          
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={
        navigation.state ==='loading' ? 'loading' : ''
      }>
        <Outlet />
      </div>
    </>
  );
}