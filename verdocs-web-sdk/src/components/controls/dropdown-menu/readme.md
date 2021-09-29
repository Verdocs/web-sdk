# dropdown-menu

## IMenuOption

| Property   | Description                                   | Required | Type           | Default     |
| ---------- | --------------------------------------------- | -------- | -------------- | ----------- |
| `label`    | Text label to show next to the item | Yes      | `string`       | -           |
| `icon`     | Optional icon to render next to the item | -        | `SVG-string`   | -           |
| `id`       | Optional field to assist in identifying which menu element was clicked | -        | `string`       | -           |
| `disabled` | If true, the option will be disabled | -        | `boolean`      | `false`     |


<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                   | Type            | Default     |
| --------- | --------- | --------------------------------------------- | --------------- | ----------- |
| `open`    | `open`    | If set, the component will be open by default | `boolean`       | `undefined` |
| `options` | --        | The menu options to display                   | `IMenuOption[]` | `undefined` |


## Events

| Event          | Description                          | Type                       |
| -------------- | ------------------------------------ | -------------------------- |
| `selectOption` | Called when a menu option is clicked | `CustomEvent<IMenuOption>` |


----------------------------------------------

*[Verdocs](https://verdocs.com/)*
