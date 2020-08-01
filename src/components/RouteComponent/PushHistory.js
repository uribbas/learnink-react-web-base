import { useHistory } from "react-router-dom";

export function PushHistory(path) {
  const history = useHistory();

  // function handleClick() {
    history.push(path);
  // }
}
