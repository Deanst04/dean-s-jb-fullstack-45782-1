import "./Demo.css";

export default function Demo() {
  const name = `Golan`;
  const age = 25;
  const isMale = true;

  const grades = [
    { id: 1, grade: 66 },
    {
      id: 2,
      grade: 77,
    },
    {
      id: 3,
      grade: 99,
    },
    {
      id: 4,
      grade: 99,
    },
  ];

  function getMessage() {
    return `dummy string`;
  }

  return (
    <div className="Demo">
      hello {name} from demo <br />
      you are {age} years old <br />
      are you male? {isMale ? `yes` : `no`} <br />
      your grades are
      <ul>
        {grades.map(({ grade, id }) => (
          <li key={id}>{grade}</li>
        ))}
      </ul>
      {getMessage()}
    </div>
  );
}
