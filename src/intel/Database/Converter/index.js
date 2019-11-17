import * as select from "../Statements/Select";

// Formats a date to YYYY-MM-DD format
const formatDate = (date) => { return date.toISOString().split('T')[0] };

export function getUser(data) {
  let platforms = data.exec(select.platform);

  // Use information of platform 0 as basic information
  let platform = platforms[0];
  let user = {};
  user.avatarUrl = platform.avatarUrl;
  user.company = platform.company;
  user.createdAt = platform.createdAt;
  user.name = platform.fullName;
  user.username = platform.username;
  user.email = platform.email;
  user.websiteUrl = platform.websiteUrl;
  user.status = platform.status;
  user.statusEmojiHTML = platform.statusEmojiHTML;
  user.isEmployee = false;
  user.isHireable = false;
  user.location = platform.location;

  return user;
};

export function getOrganizations(data) {
  let organizations = data.exec(select.organization);

  let orgs = {};
  organizations.forEach(orgWithMember => {
    if (!orgs[orgWithMember.oId]) {
      let org = {};
      org.name = orgWithMember.oName;
      org.url = orgWithMember.oUrl;
      org.avatarUrl = orgWithMember.oAvatarUrl;
      org.memberCount = 0;
      org.members = [];
      orgs[orgWithMember.oId] = org;
    };

    if(orgWithMember.mId !== undefined){
      let member = {};
      member.oid = orgWithMember.oId;
      member.name = orgWithMember.mName;
      member.login = orgWithMember.mUsername;
      member.avatarUrl = orgWithMember.mAvatarUrl;
      member.url = orgWithMember.mUrl;
      member.projectsUrl = null;

      orgs[orgWithMember.oId].memberCount++;
      orgs[orgWithMember.oId].members.push(member);
    };
  });
  return Object.values(orgs);
};

export function getRepositories(data) {
  let repositories = data.exec(select.repository);

  let repos = {};
  repositories.forEach(repoWithExtras => {
    if (!repos[repoWithExtras.rId]) {
      let repo = {};
      repo.name = repoWithExtras.rName;
      repo.avatarUrl = repoWithExtras.oAvatarUrl;

      repo.owner = {};
      repo.owner.name = repoWithExtras.oName;
      repo.owner.login = repoWithExtras.oUsername;
      repo.owner.url = repoWithExtras.oUrl;

      repo.languagePie = {};
      repo.languagePie.size = repoWithExtras.lSize;
      repo.languagePie.total = repoWithExtras.lTotal;
      repo.languagePie.slices = [];

      repo.members = [];
      repo.memberCount = 0

      repos[repoWithExtras.rId] = repo;
    };

    if(repoWithExtras.mId !== undefined){
      let member = {};
      member.oid = repoWithExtras.oId;
      member.name = repoWithExtras.mName;
      member.login = repoWithExtras.mUsername;
      member.avatarUrl = repoWithExtras.mAvatarUrl;
      member.url = repoWithExtras.mUrl;
      member.projectsUrl = null;

      repos[repoWithExtras.rId].memberCount++;
      repos[repoWithExtras.rId].members.push(member);
    };

    if(repoWithExtras.sId !== undefined){
      let slice = {};
      slice.name = repoWithExtras.sName;
      slice.color = repoWithExtras.sColor;
      slice.size = repoWithExtras.sSize;

      repos[repoWithExtras.rId].languagePie.slices.push(slice);
    };
    
  });

  return Object.values(repos);
};

export function getLanguages(data) {
  let languages = data.exec(select.language);
  let totalSize = data.exec(select.totalLanguageSize)[0].num;
  let pie = {};
  pie.slices = {};
  pie.total = totalSize;

  languages.forEach(languageSlice => {
    if (!pie.slices[languageSlice.sName]) {
      let slice = {};
      slice.name = languageSlice.sName;
      slice.color = languageSlice.sColor;
      slice.size = languageSlice.sSize;
      slice.share = Math.round(slice.size / totalSize * 100 * 100) / 100;

      pie.slices[languageSlice.sName] = slice;
    } else {
      pie.slices[languageSlice.sName].size += languageSlice.sSize;
      pie.slices[languageSlice.sName].share = Math.round(pie.slices[languageSlice.sName].size / totalSize * 100 * 100) / 100;
    };

  });
  return pie;
};

export function getCalendar(data) {
  let calendar = data.exec(select.calendar);
  let baseYear = data.exec(select.baseYearOfPlatforms)[0].baseYear;

  let calendarGrid = {};

  let date = null;
  for (let indexY = baseYear; indexY <= new Date().getFullYear(); indexY++) {
    let emptyContributionYear = {};
    emptyContributionYear.weeks = {};
    emptyContributionYear.total = 0;
    date = new Date(indexY, 0, 1);
    for (let indexW = 0; indexW < 53; indexW++) {
      let week = {};
      week.contributionDays = {};

      for (let indexD = 0; indexD <= 6; indexD++) {
        let day = {}
        date.setDate(date.getDate() + 1);
        day.total = 0
        day.date = formatDate(new Date(date));
        day.color = "#ffffff"
        week.contributionDays[indexD] = day
      }

      emptyContributionYear.weeks[indexW] = week
    }
    calendarGrid[indexY] = emptyContributionYear
  }

  calendar.forEach(day => {
    if(day.cYear){
      calendarGrid[day.cYear].total++;
      calendarGrid[day.cYear].weeks[day.cWeek].contributionDays[day.cWeekday].total++;
      calendarGrid[day.cYear].weeks[day.cWeek].contributionDays[day.cWeekday].color = day.cColor;
    }
  })
  
  return dictCalendarToArray(calculateColorsForCalendarDay(calendarGrid))
};

// Fill the raw calendar structure with the correct colors
const calculateColorsForCalendarDay = (rawCalendar) => {
  Object.values(rawCalendar).forEach(_year => {
      let busiestDay = 0;
      // Calculate busiest day of the year
      Object.values(_year.weeks).forEach(_week => {
        Object.values(_week.contributionDays).forEach(_day => {
          if (_day.total > busiestDay) {
            busiestDay = _day.total;
        };
        });
      });

      Object.values(_year.weeks).forEach(_week => {
        Object.values(_week.contributionDays).forEach(_day => {
          let precision = _day.total / busiestDay;
          if (precision > 0.8 && precision <= 1) {
              _day.color = "#196127";
          } else if (precision > 0.6 && precision <= 0.8) {
              _day.color = "#239a3b";
          } else if (precision > 0.4 && precision <= 0.6) {
              _day.color = "#7bc96f";
          } else if (precision > 0.0 && precision <= 0.4) {
              _day.color = "#c6e48b";
          } else if (precision === 0) {
              _day.color = "#ebedf0";
          };
        });
      });
  });
  
  return rawCalendar;
};

function dictCalendarToArray(dict) {
  let obj = JSON.parse(JSON.stringify(dict));
  for(var year in dict){
    for(var week in dict[year].weeks){
      obj[year].weeks[week].contributionDays = [];
      for(var day in dict[year].weeks[week].contributionDays){
        obj[year].weeks[week].contributionDays.push(dict[year].weeks[week].contributionDays[day]);
      };
    };
    obj[year].weeks = Object.values(obj[year].weeks);
  };
  return obj;
};

export function getStats(data) {
  let stats = data.exec(select.statistic);
  let totalContributionsPerYear = {};

  data.exec(select.totalContributions).forEach(elem => {
    totalContributionsPerYear[elem.year] = elem.num;
  });

  let statistics = {};

  stats.forEach(stat => {
    if(!statistics[stat.sYear]){
      let busiestDay = {};
      busiestDay.date = stat.bDate;
      busiestDay.total = stat.bTotal;

      let statistic = {};
      statistic.streaks = [];
      statistic.busiestDay = busiestDay;
      statistic.average = Math.round(totalContributionsPerYear[stat.sYear] / 365 * 100 ) / 100;

      statistic.longestStreak = 0;
      statistic.currentStreak = 0;

      statistics[stat.sYear] = statistic;
    }

    let streak = {};
    streak.startDate = stat.stsDate;
    streak.endDate = stat.steDate;
    streak.total = stat.stTotal;
    statistics[stat.sYear].streaks.push(streak);
  
    // To calculate the no. of days between two dates 
    const dateDiff = (date1, date2) => Math.abs(Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)));

    let streakDiff = dateDiff(streak.endDate, streak.startDate)
    if(statistics[stat.sYear].longestStreak <= streakDiff){
      statistics[stat.sYear].longestStreak = streakDiff;
    };

    let today = new Date();

    if(streak.endDate.getFullYear() === today.getFullYear() &&
          streak.endDate.getMonth() === today.getMonth() &&
          streak.endDate.getDate() === today.getDate()){
            statistics[stat.sYear].currentStreak = dateDiff(streak.endDate, streak.startDate)
        }
  });

  return statistics;
};

export function getContribTypes(data) {
  let contribPerPlatforms = data.exec(select.contribPerPlatform);

  let contribTypes = {};
  contribTypes.platform = {};
  contribTypes.user = {};
  contribTypes.contribs = {};

  contribPerPlatforms.forEach(contribPerPlatform => {
    if(!contribTypes.platform[contribPerPlatform.pName]){
      let platform = {};
      platform.share = 0;
      platform.count = 0;

      contribTypes.platform[contribPerPlatform.pName] = platform;
    }

    contribTypes.platform[contribPerPlatform.pName].count++;
    contribTypes.platform[contribPerPlatform.pName].share = Math.round(contribTypes.platform[contribPerPlatform.pName].count / contribPerPlatforms.length * 100 * 100) / 100;

    if(!contribTypes.user[contribPerPlatform.pId]){
      let platform = {};
      platform.share = 0;
      platform.count = 0;
      platform.name = contribPerPlatform.pName;

      contribTypes.user[contribPerPlatform.pId] = platform;
    }

    contribTypes.user[contribPerPlatform.pId].count++;
    contribTypes.user[contribPerPlatform.pId].share = Math.round(contribTypes.user[contribPerPlatform.pId].count / contribPerPlatforms.length * 100 * 100) / 100;

    if(!contribTypes.contribs[contribPerPlatform.cType]){
      let type = {};
      type.share = 0;
      type.count = 0;
      type.platform = {};
      type.user = {};

      contribTypes.contribs[contribPerPlatform.cType] = type;
    }
    
    contribTypes.contribs[contribPerPlatform.cType].count++;
    contribTypes.contribs[contribPerPlatform.cType].share = Math.round(contribTypes.contribs[contribPerPlatform.cType].count / contribPerPlatforms.length * 100 * 100) / 100;

    if(!contribTypes.contribs[contribPerPlatform.cType].platform[contribPerPlatform.pName]){
      let platform = {};
      platform.share = 0;
      platform.count = 0;

      contribTypes.contribs[contribPerPlatform.cType].platform[contribPerPlatform.pName] = platform;
    }

    contribTypes.contribs[contribPerPlatform.cType].platform[contribPerPlatform.pName].count++;
    contribTypes.contribs[contribPerPlatform.cType].platform[contribPerPlatform.pName].share = Math.round(contribTypes.contribs[contribPerPlatform.cType].platform[contribPerPlatform.pName].count / contribPerPlatforms.filter(elem => {
      return elem.cType === contribPerPlatform.cType;
    }).length * 100 * 100) / 100 ;
    
    if(!contribTypes.contribs[contribPerPlatform.cType].user[contribPerPlatform.pId]){
      let platform = {};
      platform.share = 0;
      platform.count = 0;
      platform.name = contribPerPlatform.pName;

      contribTypes.contribs[contribPerPlatform.cType].user[contribPerPlatform.pId] = platform;
    }
    
    contribTypes.contribs[contribPerPlatform.cType].user[contribPerPlatform.pId].count++;
    contribTypes.contribs[contribPerPlatform.cType].user[contribPerPlatform.pId].share = Math.round(contribTypes.contribs[contribPerPlatform.cType].user[contribPerPlatform.pId].count / contribPerPlatforms.filter(elem => {
      return elem.cType === contribPerPlatform.cType;
    }).length * 100 * 100) / 100 ;

      //contribTypes.platform[contribPerPlatform.pName] = platform
  });
  return contribTypes
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
