type Props = {
  initial: number;
  callback: (num: number) => void;
};

const NumberInput: React.FunctionComponent<Props> = ({ initial, callback }) => {
  return (
    <input
      type="number"
      value={initial}
      className="input"
      onChange={(e) => {
        const value = isNaN(e.target.valueAsNumber)
          ? null
          : e.target.valueAsNumber;
        if (value) {
          callback(e.target.valueAsNumber);
        }
      }}
    />
  );
};

export default NumberInput;
