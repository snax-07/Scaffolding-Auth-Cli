# Automa Auth CLI 🚀

A **framework-aware authentication scaffolding CLI** that generates **JWT or Session-based authentication** for modern Node.js applications like **Express** and **Next.js**.

> Automa does **not** run auth logic for you.  
> It **generates clean, production-ready auth code** directly inside your project , just alter the code as per your request.

---

## ✨ Features

- 🔐 JWT & Session authentication
- 🧠 Framework detection (Express / Next.js)
- 🧩 App Router & Pages Router support (Next.js)
- 🛠 JS & TS templates
- 🧱 Clean separation: middleware, controllers, routes, utils
- 🧯 Conflict-safe file generation
- 📦 Auto dependency installation (optional)

---

## 📦 Supported Frameworks

| Framework | Router Support | Status |
|---------|----------------|--------|
| Express | Classic | ✅ |
| Next.js | App Router | ⏱️ |
| Next.js | Pages Router | ⏱️ |

---

## 🛠 Installation

```bash
npm install -g automa
```
## ⚙️ Init the auth


### ⛮ Init the tool
```bash
automa init --flag <value>
```
#### 📋 Supported Flag ARG

```
 --auth <value>
```
- hold the auth type like jwt and session which are the currently supported one.If user don't pass this flag it will use the JWT + bcryptjs combo as defalt auth type.
----

```
--framework <value>
```
- hold the framework for the context while if user not provided the framework it will detect automatic and assume the express as their default working framework.

```
--lang <value>
```
- hold the language for whole generation context and make sure the language compatible with the user working env and this is also handled for un-passed argument which tell that default lang is JS and run the context.


### 🧩 Add the seprate auth module (Intigrating ....)

```bash
automa add --<flag>
```

#### 📋 Supported Flag ARG

```bash
automa add --psr-lang
```
- This flag is mainly used for the adding the password reset temmplate in your code base and it can easily modified by any dev. In case user passed the only init flag but not the lang flag the system initiate the default language as js.

----

````bash
automa add --msd-lan
````
- This falg tell the executor to add the mail sender but while passing the this param you need to also provide the list of the supported mail supporter and also you can also configure the path of email template , and language of the template.


```bash
automa add --msd-sender
```
- If you pass the only this template it will set the js as their default language and create the template at the controller folder.

---

  **@2026 Snax , ALL RIGHTS RESERVED**
