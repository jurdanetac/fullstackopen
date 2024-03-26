import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelect: React.FC<{
  codes: string[];
  code: string[];
  setCode: (code: string[]) => void;
}> = ({ codes, code, setCode }) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof code>) => {
    const {
      target: { value },
    } = event;
    setCode(value);
  };

  return (
    <div>
      <FormControl style={{ display: "flex" }}>
        <InputLabel id="demo-multiple-code-label">Codes</InputLabel>
        <Select
          labelId="demo-multiple-code-label"
          id="demo-multiple-code"
          multiple
          value={code}
          onChange={handleChange}
          input={<OutlinedInput label="Code" />}
          MenuProps={MenuProps}
        >
          {codes.map((c) => (
            <MenuItem key={c} value={c} style={getStyles(c, code, theme)}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelect;
