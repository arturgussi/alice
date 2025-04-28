import React from 'react';
import Svg, {Path, Defs, LinearGradient, Stop, Circle} from 'react-native-svg';
import {View} from 'react-native';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const IconAccount = ({size = 24}: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_1328_4"
          x1="9"
          y1="11"
          x2="9"
          y2="17"
          gradientUnits="userSpaceOnUse">
          <Stop stop-color="#9957DF" />
          <Stop offset="1" stop-color="#B89EFF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1328_4"
          x1="9"
          y1="1"
          x2="9"
          y2="7"
          gradientUnits="userSpaceOnUse">
          <Stop stop-color="#9957DF" />
          <Stop offset="1" stop-color="#B89EFF" />
        </LinearGradient>
      </Defs>
      <Path
        d="M1 15C1 13.9391 1.42143 12.9217 2.17157 12.1716C2.92172 11.4214 3.93913 11 5 11H13C14.0609 11 15.0783 11.4214 15.8284 12.1716C16.5786 12.9217 17 13.9391 17 15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15Z"
        stroke="url(#paint0_linear_1328_4)"
        stroke-width="1.5"
        stroke-linejoin="round"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
      <Path
        d="M1 15C1 13.9391 1.42143 12.9217 2.17157 12.1716C2.92172 11.4214 3.93913 11 5 11H13C14.0609 11 15.0783 11.4214 15.8284 12.1716C16.5786 12.9217 17 13.9391 17 15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15Z"
        stroke="black"
        stroke-opacity="0.2"
        stroke-width="1.5"
        stroke-linejoin="round"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
      <Path
        d="M9 7C10.6569 7 12 5.65685 12 4C12 2.34315 10.6569 1 9 1C7.34315 1 6 2.34315 6 4C6 5.65685 7.34315 7 9 7Z"
        stroke="url(#paint1_linear_1328_4)"
        stroke-width="1.5"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
      <Path
        d="M9 7C10.6569 7 12 5.65685 12 4C12 2.34315 10.6569 1 9 1C7.34315 1 6 2.34315 6 4C6 5.65685 7.34315 7 9 7Z"
        stroke="black"
        stroke-opacity="0.2"
        stroke-width="1.5"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
    </Svg>
  </View>
);

export const IconAdd = ({size = 24}: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.50006 4.56V14.44M4.56006 9.5H14.4401"
        stroke="#9050D4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        transform="matrix(1.263158,0,0,1.263158,0,0)"
      />
      <Circle
        cx="9.5"
        cy="9.5"
        r="9"
        stroke="#9050D4"
        transform="matrix(1.263158,0,0,1.263158,0,0)"
      />
    </Svg>
  </View>
);

export const IconHome = ({size = 24}: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 21 19" fill="none">
      <Path
        d="M1 5.67372L10.2454 1.05991C10.3245 1.02051 10.4116 1 10.5 1C10.5884 1 10.6755 1.02051 10.7546 1.05991L20 5.67372M18.1 8.51825V16.1036C18.1 16.6066 17.8998 17.0889 17.5435 17.4446C17.1872 17.8002 16.7039 18 16.2 18H4.8C4.29609 18 3.81282 17.8002 3.4565 17.4446C3.10018 17.0889 2.9 16.6066 2.9 16.1036V8.51825"
        stroke="url(#paint0_linear_1328_3)"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M1 5.67372L10.2454 1.05991C10.3245 1.02051 10.4116 1 10.5 1C10.5884 1 10.6755 1.02051 10.7546 1.05991L20 5.67372M18.1 8.51825V16.1036C18.1 16.6066 17.8998 17.0889 17.5435 17.4446C17.1872 17.8002 16.7039 18 16.2 18H4.8C4.29609 18 3.81282 17.8002 3.4565 17.4446C3.10018 17.0889 2.9 16.6066 2.9 16.1036V8.51825"
        stroke="black"
        stroke-opacity="0.2"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1328_3"
          x1="10.5"
          y1="1"
          x2="10.5"
          y2="18"
          gradientUnits="userSpaceOnUse">
          <Stop stop-color="#9957DF" />
          <Stop offset="1" stop-color="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);
