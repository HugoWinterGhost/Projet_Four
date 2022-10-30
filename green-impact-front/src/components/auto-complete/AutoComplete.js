import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const AutoComplete = ({ wastes }) => {
  const [selected, setSelected] = useState([]);

  return (
    <Typeahead
      id="autocomplete"
      onChange={setSelected}
      options={wastes}
      labelKey="name"
      placeholder="Que souhaitez-vous rechercher ?"
      emptyLabel="Aucun déchet n'a été trouvé"
      selected={selected}
    />
  );
};

export { AutoComplete };
