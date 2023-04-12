import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import {api} from "../config/params"
import React, {
  useState,useMemo,useRef
} from 'react';
function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
  
      setOptions([]);
      setFetching(true);
      const fetchId = fetchRef.current;
      fetchOptions(value).then((newOptions) => {
         if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        } 

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
 /*  const result=await axios.get(`https://mvvvip1.defas-fgi.de/mvv/XML_STOPFINDER_REQUEST?%20language=de&outputFormat=RapidJSON&type_sf=any&name_sf=${searchText}`,
   {
  mode: 'no-cors',
  
}).then((response)=>{console.log("response ",response.data);}) */
const url=api+searchText
  return fetch(url, {
  mode: 'no-cors',
  
})
    .then((response) => response.json())
    .then((data) =>
     { data.locations.map((loc) => ({
        label: `${loc.name} ${loc.disassembledName}`,
        value: loc.name,
      }))},
    );
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