import { Form } from "antd";

export function Settings() {

    return <Form>
        <HotKeyConfig label=""/>
        <HotKeyConfig/>

    </Form>;
}
function HotKeyConfig(props:{
    label:string,
    value:string
}) {
    return <Form.Item></Form.Item>;
}