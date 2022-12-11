# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

```text
NOTE: Estimating using fibonnaci story points as follows

Story Point - Estimation/Time efforts
     1      - A day or less than a day, requirements are very clear
     2      - Atleast a day, requirements are very clear
     3      - Atleast 2 - 3 days, requirements are clear
     5      - Atleast 2 - 3 days, may need slight clarity on requirements
     8      - A complex task may take the complete sprint, requirements needs to be more clear. 
              Story needs to be more descriptive
```

### EPIC 01 - Add support for generating the reports for agent in a facility

**Description**
A feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked.

**Assumptions/Points to remember**
Few points to take into consideration before working on the linked tickets

- An Agent can be part of many facilities
- A facility can have multiple shifts
- Two or more facility can have same shifts
- Tables should be normalized to reduce the anamolies and redundancies
- Utilize the existing indexes, triggers, procedure
- Each rest endpoint mentioned in the story should be private (Can be requested by an authorized user only)

```js
TICKET LINKED
- TICKET 01
- TICKET 02
- TICKET 03
- TICKET 04
- TICKET 05
- TICKET 06
```

#### TICKET 01 - Create required tables or add field in the specific table

**Description**
As a user I can add an agent within a Facility with custom id
_Note: A agent can be part of multiple facilities at a time having multiple shifts_

**AC1**
An agent can be part of various facilities

- Create a new table (facilities_agents) to establish a many to many relation ship between Agents(`agent_alias`) and Facilities(`facility_id`)
- Create an extra column `dedicated_hours`. This will keep track of the total hours dedicated by the agent to that facility.
- Table attributes facility_id and agent_alias combination should be unique

**AC2**
Multiple facilites can have similar/multiple shifts

- Create a new table (facilities_shifts) to establish a many to many relation ship between Facilities(`facility_id`) and Shifts(`shift_id`)
- Table attributes facility_id and shift_id combination should be unique

**AC3**
Add a field `agent_alias` to the Agent table

- Add a column `agent_alias` to the Agent table
- Column should be unique

```js
EPIC: EPIC 01
ESTIMATIONS: 1
```

#### TICKET 02 - Create a trigger in Database on Insert/Update of Shifts associated with the agent

**Description**
As a user I want to keep track of the total hours dedicated by the agent to the facility

**AC1**
Create a trigger in Database on Insert/Update of Shifts associated with the agent
This trigger will be responsible for updating the `dedicated_hours` in `facilites_agents` table.

- Trigger should  be triggered once the data is inserted or updated for a shift associated with the agent in that facility

```js
EPIC: EPIC 01
ESTIMATIONS: 3
BLOCKED BY: TICKET 01
```

#### TICKET 03 - Create a stored procedure in Database to get the agent dedicated hours for a specific time range

**Description**
As a user I want to keep track of the hours dedicated by the agent to the facility in a specific time period

**AC1**
Create a stored procedure in Database to get the agent dedicated hours for a specific time range
This procedure will return the `dedicated_hours` for a agent in the specific facility.

- Create a stored procedure by the name `facility_agent_hours_in_range`
- Procedure should take `facility_id`, `agent_id`, `start_date` and `end_date` as the input
- If `end_date` or `start_date` is not provided consider the default `end_date` as `NOW()` (today's date) and default `start_date` to be the date a quarter back from today.
- Should return the dedicated hours of that agent in that facility for the specified time perioed

**AC2**
To make the query fast and efficient utilize the indexes.

- Prioritize the queries on the columns having indexes such as unique, GIN, BTREE or HASH

```js
EPIC: EPIC 01
ESTIMATIONS: 3
BLOCKED BY: TICKET 01
```

#### TICKET 04 - Create an endpoint to associate an agent to the facility

**Description**
As a user I want to add a custom alias for the agent that's been associated to the facility

**AC1**
Create a POST request to associate an agent associated with the given facility

- Check for the availability of alias from the existing APIs **_(TICKET 05 LINK)_**
- Supported fields in body of the request are `facilityId`, `agentAlias`.
- Add optional fields as per the requirements

**AC2**
Create data validators for the body so that no redundant data or tampered data is processed at the BE

**AC3**
Update the documentation of the API with specific details

- Documentation should be descriptive enough
- Response status with messages should be present

```js
EPIC: EPIC 01
ESTIMATIONS: 3
BLOCKED BY: TICKET 01
```

#### TICKET 05 - Create an endpoint to check availability for the agent custom id or search agents

**Description**
As a user I want to check the availability of the custom alias for a agent in a specific facility or to search agents in that specific facility

**AC1**
Create an endpoint to check availability for the agent custom id,
This API can be used to filter the agents and check the availability for custom alias

- Create a POST request so that it's safe and can be triggered through the application.
- Support various fields in body of the request for filters such as `agentAlias`, `facilityId` etc.
- Optional Support fields in body of the request should be based on the column filters available or supported.
- Expect a specific `return_type` field in the body so as to verify whether to filter the agents or availability check.
- Above mentioned field `return_type` can have two values for the time being `boolean` and `array`
- API should be paginated for filtered agents

**AC2**
Every agent should contribute equally for a facility

- If the data return is of type `array` it should be sorted in ascending order based on the `dedicated_hours` column maintained in the `facilites_agents` table.

**AC3**
To make the query fast and efficient utilize the indexes.

- Prioritize the queries on the columns having indexes such as unique, GIN, BTREE or HASH

**AC4**
Create data validators for the body so that no redundant data or tampered data is processed at the BE

**AC5**
Update the documentation of the API with specific details

- Documentation should be descriptive enough
- Response status with messages should be present

```js
EPIC: EPIC 01
ESTIMATIONS: 5
BLOCKED BY: TICKET 01
```

#### TICKET 06 - Create an endpoint to get the facility report for a specific time period

**Description**
As a user I want to generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked

**AC1**
Create an endpoint to check availability for the agent custom id,
This API can be used to filter the agents and check the availability for custom alias

- Create a POST request so that it's safe and can be triggered through the application.
- Supported fields in body of the request are `facilityId`.
- Optinal Supported fields in body of the request are `startDate` and `endDate`.

**AC2**
To make the query fast and efficient utilize the procedure `facility_agent_hours_in_range`.

**AC3**
Create data validators for the body so that no redundant data or tampered data is processed at the BE

**AC4**
Update the documentation of the API with specific details

- Documentation should be descriptive enough
- Response status with messages should be present

```js
EPIC: EPIC 01
ESTIMATIONS: 5
BLOCKED BY: TICKET 03
```
