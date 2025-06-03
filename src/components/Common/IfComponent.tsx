export function IfComponent<T>(props: { condition: boolean; children: T }) {
    const { condition, children } = props;
    return <>{condition ? children : null}</>;
}
