# User List (take home)
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

![screenshot](https://github.com/OttoH/user-list-home-work/blob/main/images/sh1.png?raw=true)
![search by name](https://github.com/OttoH/user-list-home-work/blob/main/images/search.png?raw=true)

## Requirements
As an administrator, I must be able to
1. view a list of users and relevant details
2. enable and disable users (users are by default enabled)
3. implement at least one feature mentioned below
   - ✅ Sorting on the RegisteredAt column
   - ✅ Pagination
   - ✅ Search functionality of currentpage’s content by Name (picked)

[LIVE DEMO](https://user-list-take-home.vercel.app/)

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.The page auto-updates as you edit the file.

## The Structure
- app
  - layout.tsx - the providers is set on this
  - page.tsx - the style and structures of main page (server component)
  - thems.ts - the setup of breakpoints, color schema, and typography things.
  - [components]
    - SearchInput.tsx - a client for SearchInput of searching user names
    - UserListTable.tsx - the User List table component (client)
    - UserListTableHead.tsx - customised User List table header for sorting users by registered at field.
    - EmptyTableRow.tsx - a UX component to prevent a layout jump when fetching new users.
  - [constants]
    - url.ts - restore the api uris
  - [services]
    - randomuser.ts - the randomuser API fetcher
  - [utils]
    - createUserRowData.ts - a data transfer between API raw data and user list data of this project
    - getUserQueryUri.ts - the randomuser API URL helper
    - userResultHelper.ts - a helper for handling each API result

## tech stack
- MUI
- react-hook-form
- zod

## MUI
Try to use *[experimental_extendTheme](https://mui.com/material-ui/experimental-api/css-theme-variables/overview/)* for some dark mode setting and if it is fit for server components.

## react-hook-form + zod
react-hook-form provides a way to control the form develepment. Zod provides the solution for vlaidations and types.

The implementstion of form can be found in SearchInput.tsx

``` javascript
const searchSchema = z.object({
  searchInput: z
    .string()
    // .min(1, { message: 'Required' })
    .max(20, { message: 'Max length exceeded' })
    .regex(/^[a-zA-Z0-9 ]*$/, { message: 'Not allowed characters' })
    .describe('SearchInput is the search strign for user names.'),
})

type SearchInput = z.infer<typeof searchSchema>
```

``` javascript

const {
    handleSubmit,
    control,
    formState: { errors },
    resetField,
    watch,
  } = useForm<SearchInput>({
    defaultValues: {
      searchInput: defaultValue,
    },
    resolver: zodResolver(searchSchema),
  })

```

## How to implement search users by name
I create a data attrubute with the name data to each table row. By operate the data-search attribute natively, the row be searched could be highlighted.
``` js
// search by data attributes
  useEffect(() => {
    if (searchName) {
      document.querySelectorAll('tr[data-search]').forEach((node) => {
        node.style.opacity = '0.1'
      })

      document.querySelectorAll(`tr[data-search*="${searchName}" i]`).forEach((node) => {
        node.style.opacity = '1'
      })
    } else {
      document.querySelectorAll('tr[data-search]').forEach((node) => {
        node.style.opacity = '1'
      })
    }
  }, [searchName])
```


## Lint

For the campatibility of Linaria, we use the set of "next", "prettier", and "plugin:react-hooks/recommended" as the basement.
- [next](https://nextjs.org/docs/basic-features/eslint): the limit rule set of lint
- prettier: better support for vs-code formattor
- react-hooks/recommended: check the hook dependencies

If we want to modify the rule individually, just change the rules section in `.eslintrc.json`. Please take reference to [eslint rules](https://eslint.org/docs/latest/rules/).
