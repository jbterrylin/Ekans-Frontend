change shift list show problem

## Development Guidelines

Based on react naming strategy and development guidelines. This project was using redux as state management and saga as side effects management. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

### Handler

All of the handler function should be named as `handleChange`, `handleXChange`, `handleUpdate`. example `handleDateChange`.

### Renderer

All of the renderer function should be named as `renderX`. example `renderUsername`, `renderPassword`.

### Reducers

By default every side effects action must come with `action`, `actionSuccess`, `actionFailed` by defualt and other basic state update will base on `handler` or custom state update ( name by your own choice ).

### Sagas

By default would have defaultSaga named as `saga()` and `actionSaga`. example `loginSaga()`.

### Starting a new Page

You must create `index.js` for views, `reducers.js` for state managemnet and `sagas.js` as side effect management. If there too much styling or too much rendering you can split out to `components\` folder under the `pages` folder. example at `SchedulerPage`. Lastly, add your `reducers.js` and `sagas.js` default export to `src/store.js`'s `rootSaga` and `rootReducer`.

### Starting a new Component

You must create `index.js` for views only. Most of the time components would be small and dynamically support based on requirements so we will just use react's state management way `this.setState` to update state inside. If you want to customize a `AntForm` components, there's an example at `components/AvatarUpload`.

### Starting a new Form

Since form mostly is `create`, `update` for the models or entity ( in backend ) and only have fields based on key value map so come with a customized `AntForm` componnets. You must create a file named based on the form usage such as `createX`, `updateX`, etc. By default there's default export and list of configuration. Components is based on AntDesign so some configuration is from [Ant Design Form](https://ant.design/components/form/). For side effects call will using `request` from `utils/apisauce.js` see example in other forms.

```js
export default function(props) {
    return <AntForm {...props} {...formSetting} />
}
```

### AntForm Configuration

Here an example of `FieldObject`, `ComponentState`, `FormValues`.

```js
// ComponentState 
{
    state: {}, // component state ( this.state )
    props: {}, // component props ( this.props )
    form: {}, // form reference ( ant design <Form> ref )
    setLoader: () => true, // set form to loading state
    setVisible: () => true, // set modal to visible state ( only work when in modal mode )
    setState: this.setState, //  react setState function
}

// FieldObject
{
    key: 'key', // unique key ( react props )
    dataKey: 'key', // dataKey ( will receive based on dataKey when form onFinish )
    label: 'label display', // label of the form components
    Component: <Input />, // form component from ant design or customized
    rules: [{}], // ant design form rules
    columnSetting: {}, // ant design <Col> props
    custom: true, // custom rendering ( without <FormItem> )
    tooltip: '', // display tooltip for label ( string only )
    ..., // any other ant design <FormItem> props
}

// InvokableFieldObject
(ComponentState) => ({
    key: 'key', // unique key ( react props )
    dataKey: 'key', // dataKey ( will receive based on dataKey when form onFinish )
    label: 'label display', // label of the form components
    Component: <Input />, // form component from ant design or customized
    rules: [{}], // ant design form rules
    columnSetting: {}, // ant design <Col> props
    custom: true, // custom rendering ( without <FormItem> )
    tooltip: '', // display tooltip for label ( string only )
    ..., // any other ant design <FormItem> props
})

// GridConfig
{
    numOfColumns: 2, // number of columns per row ( row is auto calculated based on number of fields )
    rowSetting: {}, // ant design <Row> component props
    columnSetting: {}, // ant design <Col> component props ( will be override by FieldObject.columnSetting if both have same key )
}

// FormValues ( key based on 'dataKey' defined at fields) and its only one layer for dot notation have to use `unflatten` utility from `utils/object.js` to make it become multi-layer object.
{
    [keyof string]: any,
}
```

Simple explaination table about ant form configuration

| Key              | Usage                                     | Type                                 | Return Type                              |
| ---------------- | ----------------------------------------- | ------------------------------------ | ---------------------------------------- |
| title            | Define title of the form                  |                                      | string                                   |
| submitText       | Define submit button text                 |                                      | string                                   |
| formConfig       | Ant Design Form Props                     |                                      | object                                   |
| gridSetting      | Ant Design 24 Grid System Props           |                                      | object(GridConfig)                       |
| fields           | List of form components                   | function(ComponentState)             | array(FieldObject, InvokableFieldObject) |
| modal            | Define is modal component                 |                                      | boolean                                  |
| modalProps       | Antd Modal props object                   |                                      | object                                   |
| onMount          | Function to run when component mounted    | function(ComponentState)             | void                                     |
| onBack           | Function to run when back button clicked  | function(ComponentState)             | function                                 |
| onSubmit         | Function to run when form have submitted  | function(ComponentState, FormValues) | object, false, void                      |
| onLoaderChanged  | Function to run when loading state change | function(ComponentState, boolean)    | void                                     |
| onVisibleChanged | Function to run when modal visible change | function(ComponentState, boolean)    | void                                     |

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
