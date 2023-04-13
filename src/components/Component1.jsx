import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

import {api} from "../config/params"
import React, {
  useState,useMemo
} from 'react';
function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
  
      setOptions([]);
      setFetching(true);
    
      fetchOptions(value).then((newOptions) => {
        
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

async function fetchLocationList(searchText) {
  
try {
    const url=api+searchText
  return fetch(url, {
  mode: 'no-cors'
  
})
    .then((response) => response.json())
    .then((data) =>
     { data.locations.map((loc) => ({
        label: `${loc.name} ${loc.disassembledName}`,
        value: loc.name,
      }))
    });
}catch(err){console.log("error ",err);}
}

const Component1 = () => {
  const [value, setValue] =useState([]);
  return (
    <div style={{width:500,marginRight:50,marginLeft:50,marginTop:50}}>
          <label >*Start : </label>
    <div style={{float:'right',width:400}}>
    <DebounceSelect
     allowClear={true}
     mode="multiple"
      value={value}
      placeholder="search location"
      fetchOptions={fetchLocationList}
      onChange={(newValue) => {
     setValue(newValue);
      }}
      style={{
        width: '100%',
        
      }}
    />
    </div>
    </div>
  );
};

export {Component1}