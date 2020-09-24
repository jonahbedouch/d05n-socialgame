interface Members {
  [propName: string]: number;
}

interface Team {
  name: string;
  members: string[];
  pointCnt: number;
  place: number;
}

interface Teams {
  winCnt: number;
  members: Members;
  teams: Team[];
}
